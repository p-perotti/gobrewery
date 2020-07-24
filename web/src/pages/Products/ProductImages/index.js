import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Paper,
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
  Fab,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import { Delete, Add } from '@material-ui/icons';
import Image from 'material-ui-image';

import api from '~/services/api';

import { showSnackbar } from '~/store/modules/ui/actions';

import styles from './styles';

function ProductImages() {
  const classes = styles();

  const dispatch = useDispatch();

  const { id } = useParams();

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageToDeleteId, setImageToDeleteId] = useState();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoad = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`products/${id}/images`);
      setImages(response.data);
    } catch (err) {
      dispatch(showSnackbar('error', 'Não foi possível carregar os dados.'));
    }
    setIsLoading(false);
  }, [id, dispatch]);

  useEffect(() => {
    handleLoad();
  }, [handleLoad]);

  async function handleUploadImage(e) {
    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append('file', e.target.files[0]);
      await api.post(`/products/${id}/images`, data);
      setIsSubmitting(false);
      dispatch(showSnackbar('success', 'Imagem salva com sucesso.'));
    } catch (err) {
      setIsSubmitting(false);
      dispatch(showSnackbar('error', 'Não foi possível salvar a imagem.'));
    }
    handleLoad();
  }

  const handleCloseCancelDialog = () => setDialogOpen(false);

  const handleDeleteRequest = (imageId) => {
    setImageToDeleteId(imageId);
    setDialogOpen(true);
  };

  async function handleDeleteImage() {
    handleCloseCancelDialog();
    try {
      setIsSubmitting(true);
      if (imageToDeleteId) {
        await api.delete(`/products/${id}/images/${imageToDeleteId}`);
        setImageToDeleteId();
      }
      setIsSubmitting(false);
      dispatch(showSnackbar('success', 'Imagem excluída com sucesso.'));
    } catch (err) {
      setImageToDeleteId();
      setIsSubmitting(false);
      dispatch(showSnackbar('error', 'Não foi possível excluir a imagem.'));
    }
    handleLoad();
  }

  return (
    <>
      <Paper className={classes.root}>
        {!isLoading && (
          <GridList cols={3} cellHeight={300} className={classes.grid}>
            {images.map((image) => (
              <GridListTile key={image.id}>
                <Image
                  src={image.url}
                  alt={image.id}
                  imageStyle={{
                    height: 'auto',
                    position: 'relative',
                  }}
                  style={{
                    paddingTop: 'offset',
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                />
                <GridListTileBar
                  classes={{
                    root: classes.title,
                    title: classes.white,
                  }}
                  actionIcon={
                    <IconButton
                      className={classes.iconButton}
                      onClick={() => handleDeleteRequest(image.id)}
                    >
                      <Delete className={classes.white} />
                    </IconButton>
                  }
                />
              </GridListTile>
            ))}
          </GridList>
        )}
        <label htmlFor="product-image-file">
          <input
            accept="image/*"
            id="product-image-file"
            type="file"
            hidden
            onChange={handleUploadImage}
          />
          <Fab color="primary" className={classes.fab} component="span">
            <Add />
          </Fab>
        </label>
      </Paper>
      <Dialog open={dialogOpen} onClose={handleCloseCancelDialog}>
        <DialogTitle>
          <Typography component="span" variant="h6" color="primary">
            Confirma a exclusão da imagem?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Essa operação é permanente e não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog} autoFocus>
            Voltar
          </Button>
          <Button onClick={handleDeleteImage} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop open={isSubmitting} className={classes.backdrop}>
        <CircularProgress color="primary" />
      </Backdrop>
    </>
  );
}

export default ProductImages;
