
const DynamicModel = require('../models/bulkData.model');

const bulkData = async (req, res) => {
    const dynamicData = req.body;
    console.log('dynamicData',dynamicData)
    const savedRecords = [];
  try {
         savedRecords.push(...await Promise.all(dynamicData.map(async (rec) => {
            const newData = new DynamicModel(rec);
            return await newData.save();
        })));

        console.log('success');
        return res.status(201).json({ success: true, data: savedRecords });
      
    } catch (error) {
        console.log('error', error)
        res.status(400).json({ success: false, message: error.message });
    }
};

const getDynamicData = async (req, res) => {
    try {
        const data = await DynamicModel.find(); // Fetch all documents
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch data' });
    }
};



module.exports =  {bulkData, getDynamicData}