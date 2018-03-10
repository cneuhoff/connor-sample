
"use strict"
const responses = require('../models/responses')
const traumaPostsService = require('../services/traumas.service')
let _apiPrefix


module.exports = apiPrefix => {
    _apiPrefix = apiPrefix
    return {
        read: read,
        readById: readById,
        create: create,
        update: update,
        delete: _delete,
        readMine: _readMine,
        readByUserId: _readByUserId
    }
}

function _readByUserId(req, res) {
    traumaPostsService.readByUserId(req.params.userId)
        .then(traumaPost => {
            const responseModel = new responses.ItemsResponse()
            responseModel.items = traumaPost
            res.json(responseModel)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        });
}

function read(req, res) {
    traumaPostsService.read()
        .then(traumaPost => {
            const responseModel = new responses.ItemsResponse()
            responseModel.items = traumaPost
            res.json(responseModel)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        });
}

function readById(req, res) {
    traumaPostsService.readById(req.params.id)
        .then(traumaPost => {
            const responseModel = new responses.ItemResponse()
            responseModel.item = traumaPost
            res.json(responseModel)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        })
}

function create(req, res) {
    req.model.userId = req.auth.userId
    traumaPostsService.create(req.model)
        .then(id => {
            const responseModel = new responses.ItemsResponse()
            responseModel.item = id
            res.status(201)
                .location(`${_apiPrefix}/${id}`)
                .json(responseModel)

        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        })
}

function update(req, res) {
    traumaPostsService
        .update(req.params.id, req.model)
        .then(traumaPost => {
            const responseModel = new responses.SuccessResponse()
            res.status(200).json(responseModel)

        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        })
}

function _delete(req, res) {
    traumaPostsService
        .delete(req.params.id)
        .then(() => {
            const responseModel = new responses.SuccessResponse()
            res.status(200).json(responseModel)
        })
        .catch(err => {
            console.log(err)
            return res.status(500).send(new responses.ErrorResponse(err))
        })
}
