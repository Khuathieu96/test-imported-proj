import { Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { RcFile } from 'antd/lib/upload';
import { ImageType } from '../../../../types/types';

interface Props {
  handleOnChange: (value: ImageType) => void;
  imageDefault: string;
}

const UploadImage = ({ imageDefault, handleOnChange }: Props) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(imageDefault);
  useEffect(() => {
    setImageUrl(imageDefault);
  }, [imageDefault]);

  function resizeBase64Img(
    objectUrl: any,
    rangeWidth: number[],
    rangeHeight: number[],
  ) {
    return new Promise<ImageType>((resolve, reject) => {
      let img = document.createElement('img');
      img.src = objectUrl;
      var canvas = document.createElement('canvas');

      let context = canvas.getContext('2d');
      img.onload = function () {
        const maxScale = Math.max(
          1,
          img.width / rangeWidth[1],
          img.height / rangeHeight[1],
        );

        const scaleWidth = img.width / maxScale;
        const scaleHeight = img.height / maxScale;

        canvas.width = scaleWidth;
        canvas.height = scaleHeight;

        if (context) {
          context.scale(1 / maxScale, 1 / maxScale);
          context.drawImage(img, 0, 0);

          canvas.toBlob(function (blob) {
            if (blob) {
              var fileResize = new File([blob], 'image.png', {
                type: 'image/png',
              });
              const objectUrlResize = URL.createObjectURL(fileResize);

              resolve({
                url: objectUrlResize,
                width: scaleWidth,
                height: scaleHeight,
              });
            }
          });
        }
      };
    });
  }

  const beforeUpload = (file: RcFile) => {
    const rangeWidth = [500, 4000];
    const rangeHeight = [500, 4000];

    var objectUrl = URL.createObjectURL(file);

    resizeBase64Img(objectUrl, rangeWidth, rangeHeight).then((result) => {
      setImageUrl(result.url);
      handleOnChange(result);
    });
    return false;
  };

  const uploadButton = (
    <div>
      {/* {loading ? <LoadingOutlined /> : <PlusOutlined />} */}
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Upload
      name='avatar'
      listType='picture-card'
      className='avatar-uploader'
      showUploadList={false}
      // action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
      beforeUpload={beforeUpload}
      // onChange={handleChange}
    >
      {imageUrl ? (
        <img src={imageUrl} alt='avatar' style={{ width: '100%' }} />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};

export default UploadImage;
