const ApiError = require('./apiError');
class RelatedResourceNotFound extends ApiError {
  constructor() {
    super(404, 'RELATED_RESOURCE_NOT_FOUND');
  }
}

module.exports = RelatedResourceNotFound;
