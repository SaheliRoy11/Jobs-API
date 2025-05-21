
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors/index');
const Job = require('../models/Job');

const createJob = async function(req, res) {
    
    req.body.createdBy = req.user.userId;
    const newJob = await Job.create(req.body);

    return res.status(StatusCodes.CREATED).json({
        newJob
    })
}

const updateJob = async function(req, res) {

    const { user: { userId},
            body: {company, position},
            params: {id: jobID}} = req;

    //company and position values are mandatory because, if the user passes in empty value then, the fields will actually get updated with empty value.
    if(company=='' || position=='') {
        throw new BadRequestError('Company and Position values cannot be empty');
    }

    const updatedJob = await Job.findOneAndUpdate(
        {createdBy: userId, _id: jobID},
        req.body, //there can be 'status' value as well, hence we are directly passing req.body
        {new: true, runValidators: true}
    );

    if(!updatedJob) {
        throw new NotFoundError('Job with given Id not found.');
    }

    return res.status(StatusCodes.OK).json({ updatedJob });
}

const deleteJob = async function(req, res) {

    const { user: {userId}, params: {id: jobId}} = req;

    const deletedJob = await Job.findOneAndRemove({ createdBy: userId, _id: jobId});

    if(!deletedJob) {
        throw new NotFoundError('Job with given Id not found.');
    }

    return res.status(StatusCodes.OK).json({ deletedJob });
}

const getJob = async function(req, res) {

    const { user: {userId},
            params: {id: jobId }} = req;

    const job = await Job.findOne({createdBy: userId, _id: jobId});

    if(!job) {
        throw new NotFoundError('Job with given Id not found');
    }

    return res.status(StatusCodes.OK).json({
        job
    });
}

const getAllJobs = async function(req, res) {

    const allJobs = await Job.find({createdBy: req.user.userId}).sort('createdAt');

    return res.status(StatusCodes.OK).json({
        allJobs,
        count: allJobs.length
    });
}

module.exports = {
    createJob,
    updateJob,
    deleteJob,
    getJob,
    getAllJobs
};