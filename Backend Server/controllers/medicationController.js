// controllers/medicationController.js
const Medication = require('../models/Medication');
const User = require('../models/User');

async function addMedication(req, res) {
  try {
    const { name, dosageUnits, dosage, notes } = req.body;

    // Validate input
    if (!name || !dosageUnits || !dosage) {
      return res.status(400).json({ message: 'Please provide a name, dosage units, and dosage' });
    }

    // Add the medication to the database
    const newMedication = new Medication({
      name,
      dosageUnits,
      dosage,
      notes,
      user: req.userId,
    });

    await newMedication.save();
    res.json(newMedication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

async function updateMedication(req, res) {
  try {
    const { name, dosageUnits, dosage, notes } = req.body;

    // Validate input
    if (!name || !dosageUnits || !dosage) {
      return res.status(400).json({ message: 'Please provide a name, dosage units, and dosage' });
    }

    // Find the medication in the database and update it
    const medication = await Medication.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { name, dosageUnits, dosage, notes },
      { new: true }
    );

    // Check if the medication was found and updated successfully
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    res.json(medication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getMedications(req, res) {
  try {
    const { name, sortBy } = req.query;

    // Filter object based on the name query parameter
    let filterObject = {};
    if (name) {
      filterObject = { name: { $regex: name, $options: 'i' } };
    }

    // Sort object based on the sortBy query parameter
    let sortObject = {};
    if (sortBy) {
      // Assuming the sortBy parameter is in the format "direction"
      sortObject = { name: sortBy === 'desc' ? -1 : 1 };
    }

    // Fetch medications from the database with filtering and sorting applied
    const medications = await Medication.find(filterObject)
      .populate('user', 'username')
      .sort(sortObject);

    res.status(200).json(medications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

async function deleteMedication(req, res) {
  try {
    const { id } = req.params;

    // Find the medication to delete
    const deletedMedication = await Medication.findOneAndDelete({ _id: id, user: req.userId });

    if (!deletedMedication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    res.json(deletedMedication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = { addMedication, updateMedication, getMedications, deleteMedication };
