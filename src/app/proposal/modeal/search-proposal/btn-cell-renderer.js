function BtnCellRenderer() {}

BtnCellRenderer.prototype.init = function(params) {
  this.params = params;

  this.eGui = document.createElement("span");
  this.eGui.title = "Add";
  this.eGui.className = "outCircle";
  this.eGui.innerHTML =
    '<i class="fa fa-plus" style="width: 14px;cursor:pointer"></i>';

  this.btnClickedHandler = this.btnClickedHandler.bind(this);
  this.eGui.addEventListener("click", this.btnClickedHandler);
};

BtnCellRenderer.prototype.getGui = function() {
  return this.eGui;
};

BtnCellRenderer.prototype.destroy = function() {
  this.eGui.removeEventListener("click", this.btnClickedHandler);
};

BtnCellRenderer.prototype.btnClickedHandler = function(event) {
  this.params.onClick(this.params.data);
};

export default BtnCellRenderer;
