class IndicatorsController < ApplicationController
  def index
    @search = Search.find(params[:search_id])
    @indicators = @search.indicators
  end

  def update
    # @search = Search.find(params[:id])
    raise
    # each
      @indicator = Indicator.find(params[:id])
      @indicator.update(indicator_params)
  end

  private

  def indicator_params
    params.require(:indicator).permit(:weight)
  end
end
