const sequelize = require('../../config/connectDB');
const { ERROR_FAILED, MESSAGE_SUCCESS, ERROR_SUCCESS, MESSAGE_INVALID, MESSAGE_EXIST } = require('../common/messageList');
const Gallery = require('../models/Gallery');
const addGallery = (images, product_id) => {
    const arr = images.map(image => {
        return {
            image_url: image,
            product_id: product_id,
        }
    });
    return Gallery.bulkCreate(arr);
}
const deleteGallery = async (product_id) => {
    try {
        return await Gallery.destroy({
            where: {
                product_id: product_id
            }
        })
    } catch (error) {
        return result = {
            error: ERROR_SUCCESS,
            message: error.message
        }
    }

}
const updateGallery = async (images, product_id) => {
    try {
        await deleteGallery(product_id);
        await addGallery(images, product_id);
    } catch (error) {
        return result = {
            error: ERROR_SUCCESS,
            message: error.message
        }
    }


}
const getGalleryByProductId = async (req, res) => {
    try {
        const id = req.params.idProduct;
        const gallery = await Gallery.findAll({
            where: {
                product_id: id
            }
        });
        if (gallery.length > 0) {
            var result = {
                error: ERROR_FAILED,
                data: gallery,
                message: MESSAGE_SUCCESS
            }
            return res.status(200).send(result)
        }
        else {
            var result = {
                error: ERROR_SUCCESS,
                data: null,
                message: String.format(MESSAGE_EXIST, "product")
            }
            return res.status(404).send(result)
        }

    } catch (error) {
        var result = {
            error: ERROR_SUCCESS,
            message: error.message
        }
        return res.status(500).send(result)
    }
}
module.exports = { addGallery, updateGallery, deleteGallery, getGalleryByProductId };