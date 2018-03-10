// mongodb service
"use strict"

const mongodb = require('../mongodb')
const conn = mongodb.connection
const ObjectId = mongodb.ObjectId

module.exports = {
    read: read,
    readById: readById,
    create: create,
    update: update,
    delete: _delete,
    readMine: _readMine,
    readByUserId: _readByUserId
}


function _readByUserId(id) {
    return conn.db().collection('traumas').find({ userId: new ObjectId(id), dateDeactivated: null }).sort({ beginDate: -1 }).toArray()
        .then(traumaPosts => {
            for (let i = 0; i < traumaPosts.length; i++) {
                let traumaPost = traumaPosts[i]
                traumaPost._id = traumaPost._id.toString()
                traumaPost.userId = traumaPost.userId.toString()
            }
            return traumaPosts
        })
        .catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })
}

function read() {
    return conn.db().collection('traumas').find({ dateDeactivated: null }).toArray()
        .then(traumaPosts => {
            for (let i = 0; i < traumaPosts.length; i++) {
                const traumaPost = traumaPosts[i];
                traumaPost._id = traumaPost._id.toString()
                traumaPost.userId = traumaPost.userId.toString()
                for (let j = 0; j < traumaPost.viewerIds.length; j++) {
                    const viewer = traumaPost.viewerIds
                    viewer[j] = viewer[j].toString()
                }
            }
            return traumaPosts
        })
        .catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })
}

function readById(id) {
    return conn.db().collection('traumas').findOne({ _id: new ObjectId(id) })
        .then(traumaPost => {
            traumaPost._id = traumaPost._id.toString()
            traumaPost.userId = traumaPost.userId.toString()
            for (let i = 0; i < traumaPost.viewerIds.length; i++) {
                traumaPost.viewerIds[i] = traumaPost.viewerIds[i].toString()
            }
            return traumaPost
        })
        .catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })
}

function create(model) {
    const safeDoc = {
        beginDate: model.beginDate,
        endDate: model.endDate,
        type: model.type,
        summary: model.summary,
        description: model.description,
        viewerIds: [],
        userId: new ObjectId(model.userId),
        dateCreated: new Date(),
        dateModified: new Date(),
        dateDeactivated: null
    }

    if (model.viewerIds) {
        for (let i = 0; i < model.viewerIds.length; i++) {
            safeDoc.viewerIds.push(new ObjectId(model.viewerIds[i]))
        }
    }
    else {
       model.viewerIds = []
    }

    return conn.db().collection('traumas').insertOne(safeDoc)
        .then(result => result.insertedId.toString())
        .catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })

}

function update(id, model) {
    const safeDoc = {
        _id: new ObjectId(model._id),
        beginDate: model.beginDate,
        endDate: model.endDate,
        type: model.type,
        summary: model.summary,
        description: model.description,
        viewerIds: [],
        userId: new ObjectId(model.userId),
        dateModified: new Date()
    }
    
    if (model.viewerIds) {
        for (let i = 0; i < model.viewerIds.length; i++) {
            safeDoc.viewerIds.push(new ObjectId(model.viewerIds[i]))
        }
    }
    else {
       model.viewerIds = []
    }

    return conn.db().collection('traumas').updateOne({ _id: new ObjectId(id) }, { $set: safeDoc })
        .then(result => { return result.matchedCount })
        .catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })
}

function _delete(id) {
    const safeDoc = {
        $set: {
            dateDeactivated: new Date(),
            dateModified: new Date()
        }
    }
    return conn.db().collection('traumas').updateOne({ _id: new ObjectId(id) }, safeDoc)
        .then(deleteResult => undefined)
        .catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })
}
