class IndicatorsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    @search = Search.find(params[:search_id])
    @indicators = @search.indicators
    @texts = {'1' => "votre animal",
      '2' => "les commerces de bouche",
      '3' => "votre enfant",
      '4' => "les grandes surfaces",
      '5' => "le sport",
      '6' => "la médecine courante",
      '7' => "la médecine spécialisée",
      '8' => "la petite enfance",
      '9' => "la restauration",
      '10' => "les services de proximité",
      '11' => "le shopping", 
      '12' => "la vie culturelle"}
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
