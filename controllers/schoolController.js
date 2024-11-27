const db = require('../services/dbService');
const calculateDistance = require('../utils/distanceCalculator');

exports.addSchool = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Validation
    if (!name || !address || !latitude || !longitude) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    await db.execute(query, [name, address, parseFloat(latitude), parseFloat(longitude)]);

    res.status(201).json({ message: 'School added successfully.' });
  } catch (error) {
    console.error('Error adding school:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.listSchools = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required.' });
    }

    const [schools] = await db.execute('SELECT * FROM schools');

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    const sortedSchools = schools
      .map((school) => ({
        ...school,
        distance: calculateDistance(userLat, userLon, school.latitude, school.longitude),
      }))
      .sort((a, b) => a.distance - b.distance);

    res.status(200).json({ schools: sortedSchools });
  } catch (error) {
    console.error('Error listing schools:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
