import { createContext, useContext, useState, useEffect } from 'react';
import { create_order_service } from "../services/cart";
const CartContext = createContext({});

const CartProvider = (props) => {
	const [cart, setCart] = useState(() => {
		// Load cart from localStorage on initial state
		const savedCart = localStorage.getItem('cart');
		return savedCart
			? JSON.parse(savedCart)
			: { user_id: null, items: [], total_price: 0 };
	});
	const [finalCart, setFinalCart] = useState(0);
	useEffect(() => {
		const cartFromStorage = JSON.parse(localStorage.getItem("cart") || '{"items": []}');
		const items = Array.isArray(cartFromStorage.items) ? cartFromStorage.items : [];
		const newQtu = items.reduce((total, item) => total + item.quantity, 0);
		setFinalCart(newQtu);
	}, [cart]);

	const addQuantity = (productTitle, variant) => {
		setCart((prevState) => {
			const newItems = [...prevState.items];
			const existingIndex = newItems.findIndex(
				(item) => item.variantId === variant.id
			);

			if (existingIndex !== -1) {
				// Increase quantity of existing item
				newItems[existingIndex] = {
					...newItems[existingIndex],
					quantity: newItems[existingIndex].quantity + 1,
				};
			} else {
				// Add new item if it doesn't exist in the cart
				newItems.push({
					productId: variant.product_id,
					productTitle: productTitle,
					variantId: variant.id,
					color: variant.color,
					reference: variant.reference,
					color_image: variant.color_image,
					main_image: variant.main_image,
					price: variant.price,
					quantity: 2,
				});
			}

			// Recalculate the total price
			const newTotalPrice = newItems.reduce(
				(total, item) => total + item.price * item.quantity,
				0
			);

			const updatedCart = {
				...prevState,
				items: newItems,
				total_price: newTotalPrice,
			};
			return updatedCart;
		});
	};

	const removeQuantity = (variant) => {
		setCart((prevState) => {
			const newItems = [...prevState.items];
			const existingIndex = newItems.findIndex(
				(item) => item.variantId === variant.id
			);

			if (existingIndex === -1) return prevState;

			let updatedItems;
			if (newItems[existingIndex].quantity === 1) {
				updatedItems = newItems.filter(
					(item) => item.variantId !== variant.id
				);
			} else {
				updatedItems = newItems.map((item) =>
					item.variantId === variant.id
						? { ...item, quantity: item.quantity - 1 }
						: item
				);
			}

			// Recalculate the total price
			const newTotalPrice = updatedItems.reduce(
				(total, item) => total + item.price * item.quantity,
				0
			);

			const updatedCart = {
				...prevState,
				items: updatedItems,
				total_price: newTotalPrice,
			};
			return updatedCart;
		});
	};

	const addToCart = (productTitle, variant, quantity = 1) => {
		setCart((prevState) => {
			const newItems = [...prevState.items];
			const existingIndex = newItems.findIndex(
				(item) => item.variantId === variant.id
			);

			// Nëse produkti nuk ekziston dhe quantity === 1 → fut në shportë me quantity = 2
			if (existingIndex === -1 && quantity === 1) {
				newItems.push({
					productId: variant.product_id,
					productTitle: productTitle?.title,
					variantId: variant.id,
					color: variant.color,
					reference: variant.reference,
					color_image: variant.color_image,
					main_image: variant.main_image,
					price: variant.price,
					quantity: 1,
				});
			}

			const newTotalPrice = newItems.reduce(
				(total, item) => total + item.price * item.quantity,
				0
			);

			const updatedCart = {
				...prevState,
				items: newItems,
				total_price: newTotalPrice,
			};

			// Ruaj gjithmonë në localStorage
			localStorage.setItem("cart", JSON.stringify(updatedCart));

			return updatedCart;
		});
	};

	const createOrder = async (order, userInfo) => {
		try {
			const result = await create_order_service(order, userInfo);
			if (result.status !== 201 && !result.data) {
				throw new Error("Order creation failed");
			}
			return result.data;
		} catch (error) {
			console.log("error---", error);
			throw error.response.data;
		}
	};

	const values = {
		cart,
		setCart,
		addQuantity,
		addToCart,
		removeQuantity,
		createOrder,
		finalCart,
		setFinalCart
	};

	return (
		<CartContext.Provider value={values}>
			{props.children}
		</CartContext.Provider>
	);
};

const useCartContext = () => {
	return useContext(CartContext);
};

export { CartProvider, useCartContext };
