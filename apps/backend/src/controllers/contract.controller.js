const contractService = require('../services/contract.service');

class ContractController {
  async get(req, res, next) {
    try {
      const doc = await contractService.get();
      // ?meta=1: just the flags (the home page only needs `visible`, not ~80 KB of text)
      if (req.query.meta) {
        return res.json({ visible: doc?.visible, updatedAt: doc?.updatedAt });
      }
      res.json(doc);
    } catch (err) { next(err); }
  }

  async update(req, res, next) {
    try {
      const { content, visible } = req.body;
      if (typeof content !== 'string') {
        return res.status(400).json({ message: 'content is required' });
      }
      const doc = await contractService.update(content, visible);
      res.json(doc);
    } catch (err) { next(err); }
  }
}

module.exports = new ContractController();
