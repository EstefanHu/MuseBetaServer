module.exports = class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString }
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    this.query = this.query.find(queryObj);
    return this;
  }

  sort() {
    this.queryString.sort ?
      this.query = this.query.sort(this.queryString.sort.split(',').join(' '))
      : this.query = this.query.sort('credibility');
    return this;
  }

  limitFields() {
    this.queryString.fields ?
      this.query = this.query.select(this.queryString.fields.split(',').join(' '))
      : this.query = this.query.select('-__v -updatedAt');
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 20;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}