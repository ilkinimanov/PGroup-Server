const WorkImage = require('../models').models.WorkImage;


exports.createWorkImage = async(req, res) => {
  try {
    const workImageData = req.files;
    const newWork = req.work;
    newWork.save();
    let newWorkImage;
    for (let value of workImageData) {
      newWorkImage = await WorkImage.build({
        image: value.path
      });

      await newWorkImage.save();
      await newWorkImage.setWork(newWork);
      await newWork.addWorkImage(newWorkImage);
    }

    res
      .status(201)
      .redirect(`/admin/work/${newWork.id}`)
  } catch (error) {
    res
      .status(500)
      .render('admin/create-work', {
        error: 'Failed to create a work image.'
      });
  }
}

// Get all work images
async function getAllWorkImages(req, res) {
  try {
    const workImages = await db.models.WorkImage.findAll();
    res.json(workImages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve work images.' });
  }
}

// Get a work image by ID
async function getWorkImageById(req, res) {
  const workImageId = req.params.id;
  try {
    const workImage = await db.models.WorkImage.findByPk(workImageId);
    if (!workImage) {
      return res.status(404).json({ error: 'Work image not found.' });
    }
    res.json(workImage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve the work image.' });
  }
}

// Update a work image by ID
async function updateWorkImage(req, res) {
  const workImageId = req.params.id;
  const workImageData = req.body;
  try {
    const workImage = await db.models.WorkImage.findByPk(workImageId);
    if (!workImage) {
      return res.status(404).json({ error: 'Work image not found.' });
    }
    await workImage.update(workImageData);
    res.json(workImage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update the work image.' });
  }
}

// Delete a work image by ID
async function deleteWorkImage(req, res) {
  const workImageId = req.params.id;
  try {
    const workImage = await db.models.WorkImage.findByPk(workImageId);
    if (!workImage) {
      return res.status(404).json({ error: 'Work image not found.' });
    }
    await workImage.destroy();
    res.json({ message: 'Work image deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the work image.' });
  }
}
