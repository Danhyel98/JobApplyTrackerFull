const express = require('express');
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const router = express.Router();

// GET /add-job - Render the form to add a new job
router.get('/add-job', auth, (req, res) => {
  res.render('add-job'); // Ensure you have an 'add-job.ejs' file in your views directory
});

//create job
router.post('/', auth, async (req, res) => {
  console.log('Received POST request to /jobs');
  console.log('Request Body:', req.body);

  const { companyName, title, website, contactName, contactEmail, contactPhone, address, origin, status, comments } = req.body;

  if (!title || !website || !origin || !status) {
    let errors = [];
    if (!title) errors.push('Title is required');
    if (!website) errors.push('Website is required');
    if (!companyName) errors.push('Company name is required');
    if (!origin) errors.push('Origin is required');
    if (!status) errors.push('Status is required');
    
    console.log('Validation Errors:', errors);
    return res.status(400).json({ errors });
  }

  try {
    const newJob = new Job({
      user: req.user.id,
      title,
      website,
      companyName,
      contactName,
      contactEmail,
      contactPhone,
      address,
      origin,
      status,
      comments,
    });
    const job = await newJob.save();
    console.log('Job Created:', job);
    res.redirect('/dashboard'); // Redirect to dashboard after successful creation
  } catch (err) {
    console.error('Error creating job:', err.message);
    res.status(500).json({ msg: 'Server error while creating job' });
  }
});


// Render the edit job form
router.get('/edit/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).send('Job not found');
    }
    if (job.user.toString() !== req.user.id) {
      return res.status(401).send('Not authorized');
    }
    res.render('edit-job', { job });
  } catch (error) {
    console.error('Error fetching job for edit:', error);
    res.status(500).send('Server error');
  }
});

// Update the job by ID
router.post('/edit/:id', auth, async (req, res) => {
  const { title, companyName, website, contactName, contactEmail, contactPhone, address, origin, status, comments } = req.body;

  try {
    // Find the job by ID
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).send('Job not found');
    }

    // Check if the job belongs to the authenticated user
    if (job.user.toString() !== req.user.id) {
      return res.status(401).send('Not authorized');
    }

    // Update the job
    job = await Job.findByIdAndUpdate(
      req.params.id,
      { title, companyName, website, contactName, contactEmail, contactPhone, address, origin, status, comments },
      { new: true }
    );
    res.redirect(`/jobs/${job._id}`); // Redirect to the updated job detail page
  } catch (err) {
    console.error('Error updating job:', err.message);
    res.status(500).send('Server error');
  }
});





// GET /jobs - Fetch all jobs for the authenticated user
router.get('/jobs', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id });
    if (jobs.length === 0) {
      return res.status(404).json({ msg: 'No jobs found' });
    }
    res.json(jobs);
  } catch (err) {
    console.error('Error fetching jobs:', err.message);
    res.status(500).json({ msg: 'Server error while fetching jobs' });
  }
});

 //Update a job by ID
router.patch('/:id', auth, async (req, res) => {
  const { title, website, contactName, contactEmail, contactPhone, address, origin, status, comments } = req.body;

  try {
    // Find the job by ID
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Check if the job belongs to the authenticated user
    if (job.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to update this job' });
    }

    // Update the job
    job = await Job.findByIdAndUpdate(
      req.params.id,
      { title, website, contactName, contactEmail, contactPhone, address, origin, status, comments },
      { new: true }
    );
    res.json(job);
  } catch (err) {
    console.error('Error updating job:', err.message);
    res.status(500).json({ msg: 'Server error while updating job' });
  }
});

// Route to get job details by ID (GET /jobs/:id)
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).send('Job not found');
    }

    res.render('job-detail', { job }); 
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).send('Server error');
  }
});

// GET /dashboard - Render jobs view for the authenticated user
/*router.get('/dashboard', auth, async (req, res) => {
  const { status, startDate, endDate } = req.query;

  let filter = { user: req.user.id };

  if (status) {
    filter.status = status;
  }

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  try {
    const jobs = await Job.find(filter);
    if (jobs.length === 0) {
      return res.render('dashboard', { jobs: [] });
    }
    res.render('dashboard', { jobs });
  } catch (err) {
    console.error('Error fetching jobs:', err.message);
    res.status(500).json({ msg: 'Server error while fetching jobs' });
  }
});*/

  module.exports = router;

  