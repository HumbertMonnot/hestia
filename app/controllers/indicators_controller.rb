class IndicatorsController < ApplicationController
  def index
    @indicators = Indicator.all
  end

  def update
    # @search = Search.find(params[:id])
    @indicator = Indicator.find(params[:id])
    @indicator.update(indicator_params)
  end

  private

  def indicator_params
    params.require(:indicator).permit(:weight)
  end
end
