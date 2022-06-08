class SearchesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:new, :create]

   # Create #index method for the dashboard
  def index
    @searches = current_user.searches
  end

  # Create #new method for searches => view associated (used as homepage if John approval)
  def new
    @search = Search.new
  end

  # Create #create method for searches => no view associated but redirect_to => indicators#edit view
  def create
    @search = Search.new(search_params)
    @search.profile = params[:search][:profile]
    @search.user = current_user

    if @search.save
      IndicatorTitle.all.each { |indic| Indicator.create(search: @search, indicator_title: indic) }
      redirect_to search_indicators_path(@search)
    else
      render :new
    end

  end

  def show
    @search = Search.find(params[:id])
    @paras = [[@search.longitude, @search.latitude], @search.profile, @search.duration]
    @indicators = {}
    @search.indicators.each { |indic| @indicators[indic.indicator_title_id] = indic.weight }
    @indic_names = IndicatorTitle.all
  end

  private

  def search_params
    params.require(:search).permit(:address, :duration, :profile)
  end
end
