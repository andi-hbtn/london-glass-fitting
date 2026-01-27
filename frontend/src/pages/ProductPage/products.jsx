import glass_adapters from "../../images/glass_adapters.png";

const products = [
    {
        id: 1,
        title: "Luxury Chronograph Watch",
        price: 450.00,
        description: "Premium stainless steel chronograph watch with sapphire crystal glass and water resistance up to 100m. Features include date display, luminous hands, and a genuine leather strap.",
        colors: ["green", "black", "gold"],
        src: glass_adapters,
        inStock: true
    },
    {
        id: 2,
        title: "Wireless Bluetooth Headphones",
        price: 199.99,
        description: "High-fidelity wireless headphones with active noise cancellation and 30-hour battery life. Features touch controls and premium cushioned ear cups.",
        colors: ["black", "silver"],
        src: "wireless-headphones.jpg",
        inStock: true
    },
    {
        id: 3,
        title: "Premium Leather Wallet",
        price: 89.50,
        description: "Handcrafted full-grain leather wallet with multiple card slots and cash compartment. Features RFID blocking technology and a minimalist design.",
        colors: ["brown", "black"],
        src: "leather-wallet.jpg",
        inStock: false
    }
];

export default products;