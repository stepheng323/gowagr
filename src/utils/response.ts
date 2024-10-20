import { IServiceHelper } from '../types';
import { Response } from 'express';

export const convertResponse = (response: Response, data: IServiceHelper) => {
  switch (data.status) {
    case 'successful':
      return successfulResponse({
        response,
        message: data.message,
        data: data.data,
      });
    case 'created':
      return createdResponse({
        response,
        message: data.message,
        data: data.data,
      });
    case 'deleted':
      return deletedResponse({
        response,
        message: data.message,
        data: data.data,
      });
    case 'conflict':
      return conflictResponse({
        response,
        message: data.message,
        data: data.data,
      });
    case 'bad-request':
      return badRequestResponse({
        response,
        message: data.message,
        data: data.data,
      });
    case 'not-found':
      return notFoundResponse({
        response,
        message: data.message,
        data: data.data,
      });
    default:
      return badRequestResponse({
        response,
        message: data.message,
        data: data.data,
      });
  }
};

export const successfulResponse = ({ response, data, message }) => {
  return response.status(200).json({
    status: true,
    message,
    data,
  });
};

export const createdResponse = ({ response, data, message }) => {
  return response.status(201).json({
    status: true,
    message,
    data,
  });
};

export const deletedResponse = ({ response, data, message }) => {
  return response.status(200).json({
    status: true,
    message,
    data,
  });
};

export const conflictResponse = ({ response, data, message }) => {
  return response.status(409).json({
    status: false,
    message,
    data,
  });
};

export const unauthorizedResponse = ({ response, data, message }) => {
  return response.status(401).json({
    status: false,
    message,
    data,
  });
};

export const forbiddenResponse = ({ response, data, message }) => {
  return response.status(403).json({
    status: false,
    message,
    data,
  });
};

export const notFoundResponse = ({ response, data, message }) => {
  return response.status(404).json({
    status: false,
    message,
    data,
  });
};

export const serverErrorResponse = ({ response, data, message }) => {
  return response.status(500).json({
    status: false,
    message,
    data,
  });
};

export const badRequestResponse = ({ response, data, message }) => {
  return response.status(400).json({
    status: false,
    message,
    data,
  });
};

export const validationErrorResponse = ({ response, message, field }) => {
  return response.status(500).json({
    status: false,
    message: 'validation error',
    data: [
      {
        message,
        field,
        validation: 'valid',
      },
    ],
  });
};
