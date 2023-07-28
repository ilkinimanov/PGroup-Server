const Work = require('../models').models.Work;
const WorkImage = require('../models').models.WorkImage;
const multer = require('multer');
const fs = require('fs');


const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { name } = req.body;
    const imagePath = `${process.cwd()}/src/public/uploads/portfolio/${name}`
    fs.mkdirSync(imagePath, { recursive: true });
    cb(null, imagePath);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `${file.originalname}`);
  }
})

const multerFilter = (req, file, cb) => {
  if(file.mimetype.startsWith('image')) {
    cb(null, true);
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadWorkImage = upload.array('image');


exports.createWork = async(req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      res
        .status(400)
        .render('admin/create-work', {
          error: 'Failed to create work'
        })
        return;
    }
    const newWork = await Work.build({
      name: name
    });
    req.work = newWork;
    next();
  } catch (error) {
    res
      .status(500)
      .render('admin/create-work', { error: 'Failed to create a work.' });
  }
}

exports.getCreateWork = async(req, res) => {
  res
    .status(200)
    .render('admin/create-work')
}

exports.getWorkById = async(req, res) => {
  const { id } = req.params
  if(!id) {
    res
      .status(404)
      .json({
        error: "Please provide id"
      });
    return;
  }
  try {
    const work = await Work.findByPk(id);
    if (!work) {
      res
        .status(404)
        .render('errors/404', {
          error: "Work not found"
        })
      return;
    };

    const workImages = await work.getWorkImages();

    res
      .status(200)
      .render('admin/get-work', {
        work: work,
        workImages: workImages
      })

  } catch(error) {
    res
      .status(500)
      .render({
        error: error
      })
  }
}

exports.getAllWorks = async(req, res) => {
  try {
    const works = await Work.findAll({
      include: [WorkImage]
    });

    res
      .status(200)
      .render('admin/get-all-works', {
        works: works
      })
  } catch (error) {
    res
      .status(500)
      .render('admin/get-all-works', {
        error: error
      });
  }
}

exports.updateWork = async(req, res) => {
  const workId = req.params.id;
  const workData = req.body;
  try {
    const work = await db.models.Work.findByPk(workId);
    if (!work) {
      return res.status(404).json({ error: 'Work not found.' });
    }
    await work.update(workData);
    res.json(work);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update the work.' });
  }
}

exports.deleteWorkById = async(req, res) => {
  const { id } = req.params;
  if(!id) {
    res
      .status(404)
      .json({
        error: "Please provide id"
      })
  }
  try {
    const work = await Work.findByPk(id);
    if (!work) {
      return res.status(404).json({ error: 'Work not found.' });
    }
    await work.destroy();
    res
      .status(200)
      .redirect('admin/get-work')
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the work.' });
  }
}
