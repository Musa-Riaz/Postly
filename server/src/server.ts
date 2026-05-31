import app from './app';
import logger from './shared/utils/logger';

const PORT = parseInt(process.env.PORT || '3001', 10);

app.listen(PORT, '0.0.0.0', () => {
  logger.info({ PORT }, `Postly API running on http://localhost:${PORT}`);
});
