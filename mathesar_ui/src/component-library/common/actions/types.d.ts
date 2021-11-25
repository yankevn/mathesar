export interface Action<UpdateParameters> {
  update?: (parameters: UpdateParameters) => void;
  destroy: () => void;
}
