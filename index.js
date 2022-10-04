const express = require('express');
const Joi = require('joi');
const app = express();
app.use(express.json());

const customers = [
    {
        "id": 1,
        "name": "Gayan"
    },
    {
        "id": 2,
        "name": "Sunil"
    },
    {
        "id": 3,
        "name": "Nishadi"
    },
    {
        "id": 4,
        "name": "Saman"
    }
];

app.get("/", (req, res) => {
    res.send("Welcome to our REST API!");
});

app.get("/api/customers", (req, res) => {
    res.send(customers);
});

app.get("/api/customers/:id", (req, res) => {
    const customer = customers.find((c) => c.id === parseInt(req.params.id));
    
    if(!customer) {
        res.status(404).send('<h2>Oppz customer is not found for id '+req.params.id+'</h2>');
    } else {
        res.send(customer);
    }
});

app.post("/api/customers", (req, res) => {
    const {error} = validateCustomer(req.body);

    if(error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    const newCustomer = {
        id: customers.length + 1,
        name: req.body.name
    }

    customers.push(newCustomer);

    res.send(newCustomer);
});


app.put("/api/customers/:id", (req, res) => {
    const customer = customers.find((c) => c.id === parseInt(req.params.id));
    
    if(!customer) {
        res.status(404).send('<h2>Oppz customer is not found for id '+req.params.id+'</h2>');
    }

    const {error} = validateCustomer(req.body);

    if(error) {
        res.status(400).send(error.details[0].message);
    }

    customer.name = req.body.name;

    res.send(customer);
});

app.delete("/api/customers/:id", (req, res) => {
    const customer = customers.find((c) => c.id === parseInt(req.params.id));
    
    if(!customer) {
        res.status(404).send('<h2>Oppz customer is not found for id '+req.params.id+'</h2>');
    }

    const index = customers.indexOf(customer);
    customers.splice(index, 1);

    res.send("Customer "+customer.name+" is removed!");
});

function validateCustomer(customer) {
    const schema = Joi.object({ name: Joi.string() .min(3) .required()});
    
    const validation = schema.validate(customer);
    
    return validation;
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}...`));