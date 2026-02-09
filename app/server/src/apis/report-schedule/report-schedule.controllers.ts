import { Request, Response } from 'express';
import ReportScheduleService from './report-schedule.services';
import { createScheduleSchema, updateScheduleSchema } from './report-schedule.validators';
import { successResponse, errorResponse, badRequestResponse } from '../../utils/response-object';

export const createScheduleController = async (req: any, res: Response) => {
  try {
    const parsed = createScheduleSchema.safeParse(req.body);
    if (!parsed.success) {
      return badRequestResponse(res, parsed.error.flatten(), 'Validation failed');
    }

    const schedule = await ReportScheduleService.createSchedule(
      req.user.userId,
      req.user.email,
      parsed.data,
    );
    return successResponse(res, { schedule }, 'Report schedule created');
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      return badRequestResponse(res, null, error.message);
    }
    return errorResponse(res, error, 'Failed to create schedule');
  }
};

export const getMySchedulesController = async (req: any, res: Response) => {
  try {
    const schedules = await ReportScheduleService.getSchedulesByUser(req.user.userId);
    return successResponse(res, { schedules }, 'Schedules fetched');
  } catch (error: any) {
    return errorResponse(res, error, 'Failed to fetch schedules');
  }
};

export const getScheduleByTrackerController = async (req: any, res: Response) => {
  try {
    const schedule = await ReportScheduleService.getScheduleByTracker(
      req.user.userId,
      req.params.trackerId,
    );
    return successResponse(res, { schedule }, schedule ? 'Schedule found' : 'No schedule');
  } catch (error: any) {
    return errorResponse(res, error, 'Failed to fetch schedule');
  }
};

export const updateScheduleController = async (req: any, res: Response) => {
  try {
    const parsed = updateScheduleSchema.safeParse(req.body);
    if (!parsed.success) {
      return badRequestResponse(res, parsed.error.flatten(), 'Validation failed');
    }

    const schedule = await ReportScheduleService.updateSchedule(
      req.user.userId,
      req.params.id,
      parsed.data,
    );
    return successResponse(res, { schedule }, 'Schedule updated');
  } catch (error: any) {
    if (error.message === 'Schedule not found') {
      return badRequestResponse(res, null, error.message);
    }
    return errorResponse(res, error, 'Failed to update schedule');
  }
};

export const deleteScheduleController = async (req: any, res: Response) => {
  try {
    await ReportScheduleService.deleteSchedule(req.user.userId, req.params.id);
    return successResponse(res, null, 'Schedule deleted');
  } catch (error: any) {
    if (error.message === 'Schedule not found') {
      return badRequestResponse(res, null, error.message);
    }
    return errorResponse(res, error, 'Failed to delete schedule');
  }
};
