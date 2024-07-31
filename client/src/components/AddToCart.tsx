import React, { useState, useEffect } from 'react';
import { axiosRequest } from '../utils/SreverConnection';
import { Autocomplete, TextField, Container, Box, Typography, Button, List, ListItem, ListItemText, Card, CardContent, Grid, IconButton, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const AddToCart = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const [product, setProduct] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [categoryProducts, setCategoryProducts] = useState<{ [key: string]: { [key: string]: number } }>({});
    const [totalItems, setTotalItems] = useState<number>(0);
    const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
    const [notificationMessage, setNotificationMessage] = useState<string>("");
    const [orderCompleted, setOrderCompleted] = useState<boolean>(false);

    const getCategories = async () => {
        const url = `/api/categories`;
        const getCategory = await axiosRequest('get', url);
        if (getCategory.success) {
            setCategories(getCategory.result || []);
        } else {
            console.error('Failed to fetch categories');
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    const handleSearchProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProduct(e.target.value);
    };

    const handleAddProduct = () => {
        if (selectedCategory && product) {
            setCategoryProducts(prev => {
                const updatedCategoryProducts = { ...prev };
                if (!updatedCategoryProducts[selectedCategory]) {
                    updatedCategoryProducts[selectedCategory] = {};
                }
                const currentQuantity = updatedCategoryProducts[selectedCategory][product] || 0;
                updatedCategoryProducts[selectedCategory][product] = currentQuantity + 1;
                return updatedCategoryProducts;
            });
            setTotalItems(prev => prev + 1);
            setProduct("");
            setSelectedCategory(null);
        }
    };

    const handleIncrementQuantity = (category: string, productName: string) => {
        setCategoryProducts(prev => {
            const updatedCategoryProducts = { ...prev };
            if (updatedCategoryProducts[category]) {
                updatedCategoryProducts[category][productName] = (updatedCategoryProducts[category][productName] || 0) + 1;
            }
            return updatedCategoryProducts;
        });
        setTotalItems(prev => prev + 1);
    };

    const handleDecrementQuantity = (category: string, productName: string) => {
        setCategoryProducts(prev => {
            const updatedCategoryProducts = { ...prev };
            if (updatedCategoryProducts[category] && updatedCategoryProducts[category][productName]) {
                if (updatedCategoryProducts[category][productName] > 1) {
                    updatedCategoryProducts[category][productName] -= 1;
                } else {
                    delete updatedCategoryProducts[category][productName];
                    if (Object.keys(updatedCategoryProducts[category]).length === 0) {
                        delete updatedCategoryProducts[category];
                    }
                }
            }
            return updatedCategoryProducts;
        });
        setTotalItems(prev => prev - 1);
    };


    const addOrder = async () => {
        const formattedItems = Object.entries(categoryProducts).flatMap(([category, products]) =>
            Object.entries(products).map(([productName, quantity]) => ({
                category,
                productName,
                quantity
            }))
        );
        const orderData = {
            items: formattedItems
        };

        try {
            const url = '/api/shopping-list';
            const response = await axiosRequest('post', url, orderData);
            if (response.success) {
                setCategoryProducts({});
                setTotalItems(0);
                setOrderCompleted(true);  
                setNotificationMessage("Your order has been successfully received.");
                setNotificationOpen(true);
            } else {
                console.error('Failed to save order:', response.error);
            }
        } catch (error) {
            console.error('Error while saving order:', error);
        }
    };

    const handleCloseNotification = () => {
        setNotificationOpen(false);
        setOrderCompleted(false);  
    };

    return (
        <Container>
            <Box my={4}>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mt={2}
                >
                    <Typography variant="h6">
                        <span style={{
                            border: '2px solid rgb(174, 124, 61)',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            color: 'rgb(174, 124, 61)',
                            backgroundColor: 'rgba(174, 124, 61, 0.1)'
                        }}>
                            Total items: {totalItems}
                        </span>
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={addOrder}
                        sx={{
                            ml: 2,
                            backgroundColor: 'rgb(174, 124, 61)',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(174, 124, 61, 0.1)',
                                color: 'rgb(174, 124, 61)',
                            },
                        }}
                    >
                        Finish Order
                    </Button>
                </Box>
                <Box
                    display="flex"
                    justifyContent={'center'}
                    alignItems="center"
                    gap={2}
                    mt={4}
                >
                    <TextField
                        label="Search Product"
                        variant="outlined"
                        fullWidth
                        value={product}
                        onChange={handleSearchProduct}
                        sx={{
                            marginBottom: '20px',
                            width: '300px',
                            borderRadius: '4px',
                            '&:focus': {
                                borderColor: 'rgb(174, 124, 61)',
                            },
                            '& label.Mui-focused': {
                                color: 'rgb(174, 124, 61)',
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'rgb(174, 124, 61)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgb(174, 124, 61)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'rgb(174, 124, 61)',
                                },
                            },
                        }}
                    />
                    <Autocomplete
                        disablePortal
                        id="categories-autocomplete"
                        options={categories}
                        renderInput={(params) => <TextField {...params} label="Select Category" />}
                        value={selectedCategory || null}
                        onChange={(event, newValue) => setSelectedCategory(newValue)}
                        sx={{
                            marginBottom: '20px',
                            width: '300px',
                            borderRadius: '4px',
                            '&:focus': {
                                borderColor: 'rgb(174, 124, 61)',
                            },
                            '& label.Mui-focused': {
                                color: 'rgb(174, 124, 61)',
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'rgb(174, 124, 61)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgb(174, 124, 61)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'rgb(174, 124, 61)',
                                },
                            },
                        }}
                    />
                </Box>
                <Box display="flex" justifyContent="center" mt={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddProduct}
                        sx={{
                            backgroundColor: 'rgb(174, 124, 61)',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(174, 124, 61, 0.1)',
                                color: 'rgb(174, 124, 61)',
                            },
                        }}
                    >
                        Add to Cart
                    </Button>
                </Box>
                <Box mt={4}>
                    {orderCompleted ? (
                        <Typography variant="h6" align="center" sx={{ color: 'rgb(174, 124, 61)', p: 4 }}>
                            Your order has been successfully received.
                        </Typography>
                    ) : Object.keys(categoryProducts).length === 0 ? (
                        <Typography variant="h6" align="center" sx={{ color: 'rgb(174, 124, 61)', p: 4 }}>
                            Your shopping cart is empty.
                        </Typography>
                    ) : (
                        <Grid container spacing={4}>
                            {Object.keys(categoryProducts).map((category) => (
                                <Grid item xs={12} sm={6} md={4} key={category}>
                                    <Card sx={{
                                        borderRadius: '8px',
                                        boxShadow: 7,
                                        border: '2px solid rgb(174, 124, 61)',
                                        width: '100%',
                                        maxWidth: '300px',
                                        margin: '0 auto',
                                        padding: '16px',
                                        backgroundColor: 'rgba(174, 124, 61, 0.1)'
                                    }}>
                                        <CardContent>
                                            <Typography variant="h5" gutterBottom sx={{ color: 'rgb(174, 124, 61)', mb: 1 }}>
                                                {category}
                                            </Typography>
                                            <List>
                                                {Object.entries(categoryProducts[category]).map(([productName, quantity]) => (
                                                    <ListItem key={productName}>
                                                        <ListItemText
                                                            primary={
                                                                <Typography variant="body1" sx={{ color: 'rgb(174, 124, 61)' }}>
                                                                    <strong>{productName}</strong>: {quantity}
                                                                </Typography>
                                                            }
                                                        />
                                                        <Box display="flex" alignItems="center">
                                                            <IconButton onClick={() => handleIncrementQuantity(category, productName)} size="small">
                                                                <AddIcon />
                                                            </IconButton>
                                                            <IconButton onClick={() => handleDecrementQuantity(category, productName)} size="small">
                                                                <RemoveCircleIcon />
                                                            </IconButton>
                                                        </Box>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default AddToCart;
