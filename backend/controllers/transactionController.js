import Transaction from "../models/Transaction.js";

// for creating a transaction, the data will be taken from the body of the request, except from the userId
// that will be taken from the authenticated user defined in the authMiddleware
const createTransaction = async (req, res) => {
    const { description, amount, date, category, type } = req.body;
    console.log(req.body);
    const transaction = await Transaction.create({
        description,
        amount,
        date,
        category,
        type,
        userId: req.user.id
    });
    res.status(200).redirect('transactions');
};

// getting all the records of the authenticated user, that is the reason of the filter "where userId = req.user.id"
const getTransactions = async (req, res) => {
    const transactions = await Transaction.findAll({
        where: { userId: req.user.id },
        raw: true
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
        transaction.description = req.body.newDescription || transaction.description;
        transaction.amount = req.body.newAmount || transaction.amount;
        transaction.date = req.body.newDdate || transaction.date;
        transaction.category = req.body.newCcategory || transaction.category;
        transaction.type = req.body.newType || transaction.type;
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
        res.redirect('transactions'); //this is now redirecting to /auth/login
    } else {
        const error = new Error("No results found")
        return res.status(404).json({message: error.message})
    }
};

export { createTransaction, getTransactions, getOneTransaction, editTransaction, deleteTransaction };