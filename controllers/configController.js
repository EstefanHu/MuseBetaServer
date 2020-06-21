exports.getMapKey = (_, res) => {
  try {
    res.status(200).json({
      status: 'success',
      payload: process.env.MAPBOX_ACCESS_TOKEN
    });
  } catch (error) {
    res.status(500).json({ status: 'failure', payload: error });
  }
}