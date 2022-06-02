class IndicatorsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    @search = Search.find(params[:search_id])
    @indicators = @search.indicators
  end

  def update
    @indicator = Indicator.find(params[:id])
    @indicator.update(weight: (indicator_params[:weight].to_f / 10))
  end

  private

  def indicator_params
    params.require(:indicator).permit(:weight)
  end
end
