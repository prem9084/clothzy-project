import produtModel from "../models/produt.model.js";
import userModel from "../models/user.model.js";

export const getCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).populate('cart.product');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out any invalid products
    const validCartItems = user.cart.filter(item => item.product && item.product.isActive);
    
    // Calculate total
    const total = validCartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    res.json({
      cart: validCartItems,
      total,
      itemCount: validCartItems.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate product exists
    const product = await produtModel.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const user = await userModel.findById(req.user._id);
    
    // Check if item already exists in cart
    const existingItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      const newQuantity = user.cart[existingItemIndex].quantity + quantity;
      
      if (newQuantity > product.stock) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      
      user.cart[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item to cart
      user.cart.push({ product: productId, quantity });
    }

    await user.save();

    // Populate and return updated cart
    await user.populate('cart.product');
    
    const total = user.cart.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    res.json({
      message: 'Item added to cart',
      cart: user.cart,
      total,
      itemCount: user.cart.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative' });
    }

    // Validate product exists
    const product = await produtModel.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check stock availability
    if (quantity > product.stock) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const user = await userModel.findById(req.user._id);
    
    const itemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      user.cart.splice(itemIndex, 1);
    } else {
      // Update quantity
      user.cart[itemIndex].quantity = quantity;
    }

    await user.save();

    // Populate and return updated cart
    await user.populate('cart.product');
    
    const total = user.cart.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    res.json({
      message: 'Cart updated',
      cart: user.cart,
      total,
      itemCount: user.cart.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const user = await userModel.findById(req.user._id);
    
    const itemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    user.cart.splice(itemIndex, 1);
    await user.save();

    // Populate and return updated cart
    await user.populate('cart.product');
    
    const total = user.cart.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    res.json({
      message: 'Item removed from cart',
      cart: user.cart,
      total,
      itemCount: user.cart.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    user.cart = [];
    await user.save();

    res.json({
      message: 'Cart cleared',
      cart: [],
      total: 0,
      itemCount: 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};