
// import { Schema, model, Document } from 'mongoose';

// interface IShoppingList extends Document {
//   items: string[];
// }

// const shoppingListSchema = new Schema<IShoppingList>({
//   items: [{ type: String, required: true }],
// });

// const ShoppingList = model<IShoppingList>('ShoppingList', shoppingListSchema);

// export default ShoppingList;



import mongoose, { Document, Model, Schema } from 'mongoose';

// Define the interface for a shopping list item
interface ShoppingListItem {
    category: string;
    productName: string;
    quantity: number;
}

// Define the interface for the document that includes the shopping list items
interface ShoppingListDocument extends Document {
    items: ShoppingListItem[];
}

// Define the schema for ShoppingList
const shoppingListSchema: Schema = new Schema({
    items: [
        {
            category: { type: String, required: true },
            productName: { type: String, required: true },
            quantity: { type: Number, required: true }
        }
    ]
});

// Define the model for ShoppingList
const ShoppingList: Model<ShoppingListDocument> = mongoose.model<ShoppingListDocument>('ShoppingList', shoppingListSchema);

export default ShoppingList;
