class SearchesController < ApplicationController
  def index
  end

  def show
    @search = Search.find(params[:id])
    @paras = [[@search.longitude,@search.latitude], @search.profile, @search.duration]
  end
end
