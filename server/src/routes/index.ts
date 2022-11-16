import logger from '@/utils/logger';
import { Application } from 'express';

const applicationRoutes = (app: Application) => {
  const routes = () => {
    logger.info(app);
  };

  routes();
};

export default applicationRoutes;
