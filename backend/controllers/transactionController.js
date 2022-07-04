import Transaction from "../models/Transaction.js";

// for creating a transaction, the data will be taken from the body of the request, except from the userId
// that will be taken from the authenticated user defined in the authMiddleware
const createTransaction = async (req, res) => {
    const { description, amount, date, category, type } = req.body;
    const transaction = await Transaction.create({
        description,
        amount,
        date,
        category,
        type,
        userId: req.user.id
    });
    res.json(transaction);
};

// getting all the records of the authenticated user, that is the reason of the filter "where userId = req.user.id"
const getTransactions = async (req, res) => {
    const transactions = await Transaction.findAll({
        where: { userId: req.user.id }
    });
    res.json(transactions);
};

// again we use the filter to get a specific transaction only of the authenticated user, and a specific transaction id
const getOneTransaction = async (req, res) => {
    const id = req.params.id;
    
    const transaction = await Transaction.findOne({
        where: { userId: req.user.id, id}
    });

    if (transaction){
        return res.json(transaction);
    } else {
        const error = new Error("No results found")
        return res.status(404).json({message: error.message})
    }
};

// note that for the update we are setting the new values to equal the values specified in req.body, OR the previous values
const editTransaction = async (req, res) => {
    const id = req.params.id;
    
    const transaction = await Transaction.findOne({
        where: { userId: req.user.id, id}
    });

    if (transaction){
        transaction.description = req.body.description || transaction.description;
        transaction.amount = req.body.amount || transaction.amount;
        transaction.date = req.body.date || transaction.date;
        transaction.category = req.body.category || transaction.category;
        transaction.type = req.body.type || transaction.type;
        await transaction.save();
        res.json(transaction);


    } else {
        const error = new Error("No results found")
        return res.status(404).json({message: error.message})
    }
};

// almost identical to getting one specific record, but using the destroy() method
const deleteTransaction = async (req, res) => {
    const id = req.params.id;
    
    const transaction = await Transaction.findOne({
        where: { userId: req.user.id, id}
    });

    if (transaction){
        await transaction.destroy();
        res.json({message: "Transaction deleted"});
    } else {
        const error = new Error("No results found")
        return res.status(404).json({message: error.message})
    }
};

export { createTransaction, getTransactions, getOneTransaction, editTransaction, deleteTransaction };