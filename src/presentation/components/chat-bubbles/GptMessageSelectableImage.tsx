/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";

interface Props {
  text: string;
  imageUrl: string;
  alt: string;
  onImageSelected?: (imageUrl: string) => void;
}
export const GptMessageSelectableImage = ({
  imageUrl,
  onImageSelected,
}: Props) => {
  //* Referencias para guardar la imagen original y el canvas
  const originalImageRef = useRef<HTMLImageElement>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  //* Este estado se utiliza para saber si se está dibujando en el canvas
  const [isDrawing, setIsDrawing] = useState(false);
  //* Este estado se utiliza para guardar las coordenadas del mouse en el canvas
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    //*  Guarda el canvas en una variable
    const canvas = canvasRef.current!;
    //* Guarda el contexto del canvas que permitirá dibujar en él, '2d' es el tipo de contexto que permite dibujar en 2 dimensiones
    const ctx = canvas.getContext("2d");

    //* Crea una nueva imagen, 'Image' permite crear un objeto imagen que puede ser usado para dibujar en un canvas
    const image = new Image();
    //* 'crossOrigin' sirve para indicar que la imagen puede ser cargada desde un origen distinto al del documento que la contiene.
    //* 'anonymous' indica que la imagen no debe ser cargada si el origen no permite compartir recursos con el documento que la contiene.
    image.crossOrigin = "Anonymous";
    //* Guarda la url de la imagen en el atributo 'src' de la imagen creada
    image.src = imageUrl;

    //* Guardando imagen creado en su referencia
    originalImageRef.current = image;

    image.onload = () => {
      //* Dibuja la imagen en el canvas, 'drawImage' dibuja una imagen, lienzo o video en el canvas.
      //* Se le pasa la imagen, las coordenadas x e y donde se dibujará la imagen y el ancho y alto del canvas
      ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
  }, []);

  //? Función que se ejecuta cuando se presiona el mouse en el canvas
  const onMouseDown = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    setIsDrawing(true);

    //* Obtener las coordenadas del mouse relativo al canvas

    //* 'clientX' devuelve la coordenada horizontal de la posición del mouse cuando se presiona un botón del mouse.
    //* 'getBoundingClientRect()' devuelve el tamaño de un elemento y su posición relativa respecto a la ventana de visualización.
    //* 'left' devuelve la posición horizontal del borde izquierdo del elemento.
    //* 'clientY' devuelve la coordenada vertical de la posición del mouse cuando se presiona un botón del mouse.
    //* 'top' devuelve la posición vertical del borde superior del elemento.
    const startX =
      event.clientX - canvasRef.current!.getBoundingClientRect().left;
    const startY =
      event.clientY - canvasRef.current!.getBoundingClientRect().top;

    // console.log({startX, startY});
    setCoords({ x: startX, y: startY });
  };

  //? Funcion que se ejecuta al soltar el mouse 
  const onMouseUp = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current!;

    //* Obtener la imagen del canvas en formato base64 
    const url = canvas.toDataURL("image/png");
    // console.log(url);
    // https://jaredwinick.github.io/base64-image-viewer/

    //* Llamar a la función 'onImageSelected' con la url de la imagen para que se muestre en el chat
    onImageSelected && onImageSelected(url);
  };

  //? Función que se ejecuta cuando se mueve el mouse en el canvas 
  const onMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!isDrawing) return;

    const currentX =
      event.clientX - canvasRef.current!.getBoundingClientRect().left;
    const currentY =
      event.clientY - canvasRef.current!.getBoundingClientRect().top;

    //* Calcular el alto y ancho del rectángulo
    const width = currentX - coords.x;
    const height = currentY - coords.y;

    //* Guardar el ancho y alto del canvas 
    const canvaWidth = canvasRef.current!.width;
    const canvaHeight = canvasRef.current!.height;

    //* Limpiar el canva
    const ctx = canvasRef.current!.getContext("2d")!;

    //* clearRect() limpia el contenido de un rectángulo especificado del canvas
    //* Se ke pasa las coordenadas x e y del rectángulo y su ancho y alto 
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    //* Dibujar la imagen original en el canvas 
    ctx.drawImage(originalImageRef.current!, 0, 0, canvaWidth, canvaHeight);

    // Dibujar el rectangulo, pero en este caso, limpiaremos el espacio
    // ctx. fillRect(coords.x, coords.y, width, height);
    ctx.clearRect(coords.x, coords.y, width, height);
  };

  const resetCanva = () => {
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    ctx.drawImage(
      originalImageRef.current!,
      0,
      0,
      canvasRef.current!.width,
      canvasRef.current!.height
    );

    onImageSelected && onImageSelected(imageUrl);
  };

  return (
    <div className="col-start-1 col-end-9 p-3 rounded-lg">
      <div className="flex flex-row items-start">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-600 flex-shrink-0">
          G
        </div>
        <div className="relative ml-3 text-sm bg-black bg-opacity-25 pt-3 pb-2 px-4 shadow rounded-xl">
          <canvas
            ref={canvasRef}
            width={1024}
            height={1024}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
          />

          <button onClick={resetCanva} className="btn-primary mt-2">
            Borrar selección
          </button>
        </div>
      </div>
    </div>
  );
};
