import { BaseSize } from "../enums/BaseSizeEnum";

const calculateScaleRatio = () => {
  const { clientWidth, clientHeight } = document.documentElement;
  return clientWidth / clientHeight > BaseSize.WIDTH / BaseSize.HEIGHT
    ? clientHeight / BaseSize.HEIGHT
    : clientWidth / BaseSize.WIDTH;
};

function updateRootFontSize() {
  const scaleRatio = calculateScaleRatio();
  document.documentElement.dataset.scaleRatio = scaleRatio.toString();
  document.documentElement.style.fontSize = `${
    scaleRatio * BaseSize.FONT_SIZE
  }px`;
}

updateRootFontSize();

window.addEventListener("resize", updateRootFontSize);
