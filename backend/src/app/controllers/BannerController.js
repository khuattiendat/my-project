const {getAllBanner} = require('../services/BannerService');
const {ERROR_SUCCESS} = require("../common/messageList");
const appRoot = require('app-root-path');
const {
    addBanner,
    getAllBannerIsActive,
    updateBanner,
    deleteBanner,
    updateIsActive, getBannerById
} = require(appRoot + "/src/app/services/BannerService");
const BannerController = {
    getAllBanner: async (req, res) => {
        try {
            const page = req.body.page;
            const banners = await getAllBanner(page);
            if (banners.error !== ERROR_SUCCESS) {
                res.status(200).send(banners);
            } else {
                res.status(400).send(banners);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    getAllBannerIsActive: async (req, res) => {
        try {
            const banners = await getAllBannerIsActive();
            if (banners.error !== ERROR_SUCCESS) {
                res.status(200).send(banners);
            } else {
                res.status(400).send(banners);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    getBannerById: async (req, res) => {
        try {
            const id = req.params.id;
            const banner = await getBannerById(id);
            if (banner.error !== ERROR_SUCCESS) {
                res.status(200).send(banner);
            } else {
                res.status(400).send(banner);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
    ,
    updateIsActive: async (req, res) => {
        try {
            const id = req.params.id;
            const data = req.body;
            const banner = await updateIsActive(id, data);
            if (banner.error !== ERROR_SUCCESS) {
                res.status(200).send(banner);
            } else {
                res.status(400).send(banner);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    addBanner:
        async (req, res) => {
            try {
                const files = req.files;
                const banner = await addBanner(req, files);
                if (banner.error !== ERROR_SUCCESS) {
                    res.status(200).send(banner);
                } else {
                    res.status(400).send(banner);
                }
            } catch (error) {
                res.status(500).send(error.message);
            }
        },
    updateBanner:
        async (req, res) => {
            try {
                const files = req.files;
                const id = req.params.id;
                const data = req.body;
                const banner = await updateBanner(id, data, files);
                if (banner.error !== ERROR_SUCCESS) {
                    res.status(200).send(banner);
                } else {
                    res.status(400).send(banner);
                }
            } catch (error) {
                res.status(500).send(error.message);
            }
        },
    deleteBanner:
        async (req, res) => {
            try {
                const id = req.body.id;
                const banner = await deleteBanner(id);
                if (banner.error !== ERROR_SUCCESS) {
                    res.status(200).send(banner);
                } else {
                    res.status(400).send(banner);
                }
            } catch (error) {
                res.status(500).send(error.message);
            }
        }
}
module.exports = BannerController;