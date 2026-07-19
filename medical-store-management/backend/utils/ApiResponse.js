class ApiResponse {
  static success(res, options = {}) {
    const payload = {
      success: true,
      message: options.message || 'Request completed successfully',
      data: options.data || {},
    };

    if (options.meta) {
      payload.meta = options.meta;
    }

    if (options.pagination) {
      payload.pagination = options.pagination;
    }

    return res.status(options.statusCode || 200).json(payload);
  }

  static created(res, options = {}) {
    return this.success(res, { ...options, statusCode: 201 });
  }

  static noContent(res) {
    return res.status(204).send();
  }

  static paginated(res, options = {}) {
    return this.success(res, {
      ...options,
      statusCode: options.statusCode || 200,
      pagination: options.pagination,
    });
  }
}

module.exports = ApiResponse;
