import express from 'express'
import bodyParser from 'body-parser'
import Controller from './controller.mjs'
const app = express()
const port = 3000
const ctrl = new Controller()
// start controller looping
ctrl.loop({
    interval: 1000
})

// add body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// ADD route
app.post('/add', (req, res) => {
    // get the body of the POST request
    const { body } = req
    // add body validations
    if (!body.identifier || !body.callback || !body.reactionTime) {
        return res.status(400).send('Bad Request')
    }
    // add the body to the watchers array
    ctrl.add(body)
    res.send(`Added new watcher for service with identifier: ${body.identifier}`)
})

// DELETE route
app.delete('/del/:identifier', (req, res) => {
    // get the identifier from the url
    const { identifier } = req.params
    // delete the watcher from the watchers array
    ctrl.del(identifier)
    res.send('Delete watcher with identifier: ' + identifier)
})

// Trigger route
app.get('/trigger/:identifier', (req, res) => {
    // get the identifier from the url
    const { identifier } = req.params
    // trigger the watcher
    ctrl.trigger(identifier)
    res.send('Trigger watcher with identifier: ' + identifier)
})

// start express server
app.listen(port, () => {
    console.log(`trigger-or-cry started on port: ${port}`)
})