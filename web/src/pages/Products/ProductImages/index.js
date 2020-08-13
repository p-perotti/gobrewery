import React, { useState, useCallback } from 'react';
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

import Loader from '~/components/Loader';

import api from '~/services/api';

import { showSnackbar } from '~/store/modules/ui/actions';

import styles from './styles';

function ProductImages() {
  const classes = styles();

  const dispatch = useDispatch();

  const { id } = useParams();

  const [images, setImages] = useState([]);
  const [imageToDeleteId, setImageToDeleteId] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadImages = useCallback(async () => {
    const response = await api.get(`products/${id}/images`);
    setImages(response.data);
  }, [id]);

  async function handleUploadImage(e) {
    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append('file', e.target.files[0]);
      await api.post(`/products/${id}/images`, data);
      setIsSubmitting(false);
      dispatch(showSnackbar('success', 'Imagem salva com sucesso.'));
    } catch (error) {
      setIsSubmitting(false);
      dispatch(showSnackbar('error', 'Não foi possível salvar a imagem.'));
    }
    loadImages();
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
        await api.delete(`products/${id}/images/${imageToDeleteId}`);
        setImageToDeleteId();
      }
      setIsSubmitting(false);
      dispatch(showSnackbar('success', 'Imagem excluída com sucesso.'));
    } catch (error) {
      setImageToDeleteId();
      setIsSubmitting(false);
      dispatch(showSnackbar('error', 'Não foi possível excluir a imagem.'));
    }
    loadImages();
  }

  return (
    <>
      <Paper>
        <Loader loadFunction={loadImages}>
          <div className={classes.root}>
            <GridList cols={3} cellHeight={300} className={classes.grid}>
              {images.map((image) => (
                <GridListTile key={image.id}>
                  <img src={image.url} alt={image.id} />
                  <GridListTileBar
                    classes={{
                      root: classes.title,
                      title: classes.white,
                    }}
                    titlePosition="top"
                    actionIcon={
                      <IconButton onClick={() => handleDeleteRequest(image.id)}>
                        <Delete className={classes.white} />
                      </IconButton>
                    }
                  />
                </GridListTile>
              ))}
            </GridList>
          </div>
        </Loader>
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
