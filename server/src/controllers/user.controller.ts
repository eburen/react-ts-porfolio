import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user.model';
import Address from '../models/address.model';

// Get user addresses
export const getUserAddresses = async (req: Request, res: Response) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    res.json(addresses);
  } catch (error: any) {
    console.error('Get addresses error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add a new address
export const addUserAddress = async (req: Request, res: Response) => {
  try {
    const { street, city, state, postalCode, country, isDefault } = req.body;

    // If this is the default address, unset any existing default
    if (isDefault) {
      await Address.updateMany(
        { user: req.user._id, isDefault: true },
        { isDefault: false }
      );
    }

    const address = await Address.create({
      user: req.user._id,
      street,
      city,
      state,
      postalCode,
      country,
      isDefault: isDefault || false,
    });

    res.status(201).json(address);
  } catch (error: any) {
    console.error('Add address error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an address
export const updateUserAddress = async (req: Request, res: Response) => {
  try {
    const { street, city, state, postalCode, country, isDefault } = req.body;
    const addressId = req.params.id;

    // Validate address ID
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ message: 'Invalid address ID' });
    }

    // Find address and check ownership
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    if (address.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this address' });
    }

    // If this is being set as default, unset any existing default
    if (isDefault && !address.isDefault) {
      await Address.updateMany(
        { user: req.user._id, isDefault: true },
        { isDefault: false }
      );
    }

    // Update address
    address.street = street || address.street;
    address.city = city || address.city;
    address.state = state || address.state;
    address.postalCode = postalCode || address.postalCode;
    address.country = country || address.country;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    const updatedAddress = await address.save();
    res.json(updatedAddress);
  } catch (error: any) {
    console.error('Update address error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete an address
export const deleteUserAddress = async (req: Request, res: Response) => {
  try {
    const addressId = req.params.id;

    // Validate address ID
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ message: 'Invalid address ID' });
    }

    // Find address and check ownership
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    if (address.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this address' });
    }

    await Address.findByIdAndDelete(addressId);
    res.json({ message: 'Address deleted successfully' });
  } catch (error: any) {
    console.error('Delete address error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 