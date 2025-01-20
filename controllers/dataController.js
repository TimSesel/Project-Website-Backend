var DataModel = require('../models/dataModel.js');
var DataModelCompression = require('../models/dataModelCompression.js');
const mongoose = require('mongoose');

/**
 * dataController.js
 *
 * @description :: Server-side logic for managing datas.
 */
module.exports = {

    /**
     * dataController.list()
     */
    list: function (req, res) {
        DataModel.find(function (err, datas) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting data.',
                    error: err
                });
            }

            return res.json(datas);
        });
    },

    dates: function (req, res) {
        try {
            DataModel.aggregate([
                {
                    $group: {
                        _id: {
                            year: { $year: "$date" },
                            month: { $month: "$date" },
                            day: { $dayOfMonth: "$date" }
                        },
                        data: { $push: "$$ROOT" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        date: {
                            $dateFromParts: {
                                year: "$_id.year",
                                month: "$_id.month",
                                day: "$_id.day"
                            }
                        },
                        data: 1
                    }
                },
                {
                    $sort: {
                        date: 1
                    }
                }
            ])
            .exec(function (err, dates) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting dates.',
                        error: err
                    });
                }
    
                return res.json(dates);
            });
        } catch(err) {
            return res.status(500).json({
                message: 'Error when getting dates.',
                error: err
            });
        }
    },

    add: function (req, res) {
        return res.render('data/add');
    },

    /**
     * dataController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        DataModel.findOne({_id: id}, function (err, data) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting data.',
                    error: err
                });
            }

            if (!data) {
                return res.status(404).json({
                    message: 'No such data'
                });
            }

            return res.json(data);
        });
    },

    /**
     * dataController.create()
     */
    create: function (req, res) {
        var data = new DataModel({
			latitude : req.body.latitude,
			longitude : req.body.longitude,
            decibels : req.body.decibels,
            radius : req.body.radius,
            userId : req.body.id ? mongoose.Types.ObjectId(req.body.id) : req.session.userId,
        });
        data.save(function (err, data) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating data',
                    error: err
                });
            }
            return res.status(201).json(data);
        });
    },

    createCompressed: function (req, res) {
        var json_data = JSON.stringify(req.body);
        var spawn = require('child_process').spawn;
        var child = spawn('sh', ['-c', `cd ~/project/Project-Parallel-Compression/ && just compress huffman 2`]);

        var stdout = '';
        child.stdout.on('data', function (data) {
            stdout += data.toString();
        });

        child.stderr.on('data', function (data) {
            console.error(`stderr: ${data}`);
        });

        child.on('close', function (code) {
            var data = new DataModelCompression({
                info : stdout,
            });
            data.save(function (err, data) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating data',
                        error: err
                    });
                }
                return res.status(201).json(data);
            });
        });

        child.stdin.write(json_data);
        child.stdin.end();
    },

    /**
     * dataController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        DataModel.findOne({_id: id}, function (err, data) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting data',
                    error: err
                });
            }

            if (!data) {
                return res.status(404).json({
                    message: 'No such data'
                });
            }

            // data.location = req.body.location ? req.body.location : data.location;
			data.latitude = req.body.latitude ? req.body.latitude : data.latitude;
			data.longitude = req.body.longitude ? req.body.longitude : data.longitude;
			data.date = req.body.date ? req.body.date : data.date;
            data.decibels = req.body.decibels ? req.body.decibels : data.decibels;
            data.radius = req.body.radius ? req.body.radius : data.radius;
			
            data.save(function (err, data) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating data.',
                        error: err
                    });
                }

                return res.json(data);
            });
        });
    },

    /**
     * dataController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        DataModel.findByIdAndRemove(id, function (err, data) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the data.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
