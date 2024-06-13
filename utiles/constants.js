const STATUS_CODES = {
  success: 200,
  created: 201,
  found: 302,
  seeOther: 303,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  error: 500,
};

const getStatusMessage = (code) => {
  switch (code) {
    case 200:
      return "OK";
    case 201:
      return "Created";
    case 302:
      return "Found";
    case 303:
      return "See Other";
    case 400:
      return "Bad Request";
    case 401:
      return "Unauthorized";
    case 403:
      return "Forbidden";
    case 404:
      return "Not Found";
    case 409:
      return "Conflict";
    case 500:
      return "Internal Server Error";
    default:
      return "Unknown Status";
  }
};

module.exports = { STATUS_CODES, getStatusMessage };
