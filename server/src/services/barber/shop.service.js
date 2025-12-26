import Address from "../../models/Address.js";
import BarberShop from "../../models/BarberShop.js";
import ApiError from "../../utils/helper/apiError.js";

const createShop = async (barberId, payload) => {
  const {
    shopName,
    description,
    licenseNo,
    shopType,
    openingTime,
    closingTime,
    photos,
    address
  } = payload;

  // Check if shop already exists
  const existing = await BarberShop.query()
    .findOne({ barberId });

  if (existing) {
    throw new ApiError(409, "Shop already exists for this barber");
  }

  // Create address (optional but recommended)
  let addressRecord = null;
  if (address) {
    addressRecord = await Address.query().insert({
      street: address.street,
      landmark: address.landmark,
      city: address.city,
      state: address.state,
      country: address.country || "India",
      pincode: address.pincode,
      lat: address.lat,
      lng: address.lng
    });
  }

  // Create shop
  const shop = await BarberShop.query().insert({
    barberId,
    shopName,
    description,
    licenseNo,
    shopType,
    openingTime,
    closingTime,
    photos,
    addressId: addressRecord?.id || null
  });

  return shop;
}

const deleteShop = async ({ shopId, user }) => {
  // 1. Find shop
  const shop = await BarberShop.query().findById(shopId);

  if (!shop) {
    throw new ApiError(404, "Shop not found");
  }

  // 2. Find barber owning the shop
  const barber = await BarberShop.query().findById(shop.barberId);

  if (!barber) {
    throw new ApiError(404, "Barber not found for this shop");
  }

  // 3. Authorization
  const isOwner = barber.userId === user.id;
  const isAdmin = ["admin", "superAdmin"].includes(user.role);

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "You are not allowed to delete this shop");
  }

  // 4. Delete shop
  await BarberShop.query().deleteById(shopId);

  return {
    message: "Shop deleted successfully",
  };
}


const updateShop = async ({ shopId, userId, payload }) => {
  const shop = await BarberShop.query().findById(shopId);

  if (!shop) {
    throw new ApiError(404, "Shop not found");
  }

  const barber = await BarberShop.query().findById(shop.barberId);

  if (!barber) {
    throw new ApiError(404, "Barber not found for this shop");
  }

  // Authorization
  const isOwner = barber.userId === user.id;
  const isAdmin = ["admin", "superAdmin"].includes(user.role);

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "You are not allowed to update this shop");
  }

  const updatedShop = await BarberShop.query().patchAndFetchById(shopId, payload);
  return updatedShop;
}

export async function updateShop(barberId, shopId, data) {
  const shop = await BarberShop.query()
    .where({ id: shopId, barberId })
    .first();

  if (!shop) {
    throw new ApiError(404, "Shop not found");
  }

  return BarberShop.query()
    .patchAndFetchById(shopId, data);
}

export default {
  createShop,
  deleteShop,
  updateShop,
};

