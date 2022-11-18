import cloudinary, {
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';

export const uploadImage = async (
  file: string,
  public_id?: string,
  overwrite?: boolean,
  invalid?: boolean,
): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> => {
  const options = {
    public_id,
    overwrite,
    invalid,
  };

  return await cloudinary.v2.uploader.upload(
    file,
    options,
    (
      error: UploadApiErrorResponse | undefined,
      result: UploadApiResponse | undefined,
    ) => {
      if (error) {
        throw new Error(`${error.name}: ${error.message}`);
      }
      return result;
    },
  );
};
