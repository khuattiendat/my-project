const { ERROR_SUCCESS } = require("../common/messageList");
const { getAllTransaction, searchTransactions, getLatestTransaction, getTransactionByUserId, getTransactionById } = require("../services/transactionService");

const TransactionController = {
    getAllTransaction: async (req, res,) => {
        try {
            const page = req.query.page
            const value = req.query.q;
            const transaction = await getAllTransaction(page, value);
            if (transaction.error !== ERROR_SUCCESS) {
                res.status(200).send(transaction)
            }
            else {
                res.status(400).send(transaction)
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    getTransactionByUserId: async (req, res) => {
        try {
            const userId = req.query.userId;
            const page = req.query.page;
            const transaction = await getTransactionByUserId(userId, page)
            if (transaction.error !== ERROR_SUCCESS) {
                res.status(200).send(transaction)
            }
            else {
                res.status(400).send(transaction)
            }
        } catch (error) {

        }
    },
    getLatestTransaction: async (req, res) => {
        try {
            const transaction = await getLatestTransaction();
            if (transaction.error != ERROR_SUCCESS) {
                res.status(200).send(transaction)
            }
            else {
                res.status(400).send(transaction)
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    getTransactionById: async (req, res) => {
        try {
            const id = req.params.id;
            const transaction = await getTransactionById(id);
            if (transaction.error != ERROR_SUCCESS) {
                res.status(200).send(transaction)
            }
            else {
                res.status(400).send(transaction)
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}
module.exports = TransactionController;