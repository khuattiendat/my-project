const {ERROR_SUCCESS, MESSAGE_SUCCESS, ERROR_FAILED} = require("../common/messageList");
const Banner = require("../models/Banner");
const {isNullOrWhiteSpace, isNullOrEmptyArray} = require("../common/utils");
const getAllBanner = async (page = 1) => {
    try {
        let banners = [];
        let totalPage = 1;
        let perPage = parseInt(process.env.PAGE_SIZE);
        let offset = (page - 1) * perPage;
        if (page < 1) {
            page = 1;
        }
        const {count, rows} = await Banner.findAndCountAll({
            limit: perPage,
            offset: offset,
        })
        await rows.forEach((item) => {
            banners.push(item.dataValues);
        });
        totalPage = Math.ceil(count / perPage)
        return {
            error: ERROR_FAILED,
            data: {
                banners,
                totalPage
            },
            message: MESSAGE_SUCCESS
        };
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }
}
const getAllBannerIsActive = async () => {
    try {
        const banners = await Banner.findAll({
            where: {
                is_active: 1
            }
        });
        return {
            error: ERROR_FAILED,
            data: banners,
            message: MESSAGE_SUCCESS
        };
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }
}
const getBannerById = async (id) => {
    try {
        const banner = await Banner.findOne({
            where: {
                id: id
            }
        })
        if (!banner) {
            return {
                error: ERROR_SUCCESS,
                message: 'Banner not found'
            };
        }
        return {
            error: ERROR_FAILED,
            data: banner
        };
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }

}
const updateIsActive = async (id, data) => {
    try {
        const row = await Banner.findOne({
            where: {
                id: id
            }
        })
        if (!row) {
            return {
                error: ERROR_SUCCESS,
                message: 'Banner not found'
            };
        }
        await Banner.update({
            is_active: data.is_active
        }, {
            where: {
                id: id
            }
        })
        return {
            error: ERROR_FAILED,
            data: row
        };
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }

}
const addBanner = async (req, files) => {
    try {
        const messages = [];
        if (req.fileValidationError) {
            messages.push(req.fileValidationError);
        } else if (req.files.length === 0) {
            messages.push('Please select an image to upload')
        }
        if (!isNullOrEmptyArray(messages)) {
            return {
                error: ERROR_SUCCESS,
                data: null,
                message: messages
            };
        }
        const banner = await Banner.create({
            image_url: files[0].filename,
            title: req.body.title,
            is_active: 1
        })
        await banner.save();
        return ({
            error: ERROR_FAILED,
            data: banner
        });
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }
}
const updateBanner = async (id, data, files) => {
    try {
        const row = await Banner.findOne({
            where: {
                id: id
            }
        })
        if (!row) {
            return {
                error: ERROR_SUCCESS,
                message: 'Banner not found'
            };
        }
        if (!files.length) {
            await Banner.update({
                title: data.title,
            }, {
                where: {
                    id: id
                }
            })
        } else {
            await Banner.update({
                image_url: files[0].filename,
                title: data.title,
            }, {
                where: {
                    id: id
                }
            })
        }
        return {
            error: ERROR_FAILED,
            data: row
        };
    } catch
        (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };

    }
}
const deleteBanner = async (id) => {
    try {
        const row = await Banner.findOne({
            where: {
                id: id
            }
        })
        if (!row) {
            return {
                error: ERROR_SUCCESS,
                message: 'Banner not found'
            };
        }
        await Banner.destroy({
            where: {
                id: id
            }
        })
        return {
            error: ERROR_FAILED,
            message: MESSAGE_SUCCESS
        };
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }

}

module.exports = {
    getAllBanner,
    addBanner,
    getAllBannerIsActive,
    updateBanner,
    deleteBanner,
    updateIsActive,
    getBannerById
}