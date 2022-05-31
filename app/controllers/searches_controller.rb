class SearchesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:new, :create]

  def index
  end

  # Create #new method for searches => view associated (used as homepage if John approval)
  def new
    @search = Search.new
    # Need indicator to redirect to indicator show
  end

  # Create #create method for searches => no view associated but redirect_to => indicators#edit view
  def create
    @search = Search.new(search_params)
    # @indicator = Indicator.find(params[:id])
    @search.user = current_user
    @indicators = Indicator.select(:weight)
    @indicators.create
    @indicator_titles = IndicatorTitle.all
    @indicator_titles.each do |indicator_title|
      indicator_title.create
      #create sur indicator indicator_title: indicator_title
    end
    if @search.save
      redirect_to edit_search_indicator_path(@indicator)
    else
      render :new
    end
  end

  def show
  end

  private

  def search_params
    params.require(:search).permit(:address, :duration, :profile)
  end
end
