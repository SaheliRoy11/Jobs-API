
const { createJob,
        updateJob,
        deleteJob,
        getJob,
        getAllJobs } = require('../../../controllers/jobs');
const router = require('express').Router();

router.route('/').get(getAllJobs).post(createJob);
router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob);

module.exports = router;