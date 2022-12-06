import { serverAdapter } from '@/shared/services/queues/BaseQueue';
import { authRoutes } from '@/features/auth/routes/AuthRoutes';
import { Application } from 'express';

const BASE_PATH = '/api/v1';

const applicationRoutes = (app: Application) => {
  const routes = () => {
    app.use('/queues', serverAdapter.getRouter());
    app.use(BASE_PATH, authRoutes.routes());
  };

  routes();
};

export default applicationRoutes;
