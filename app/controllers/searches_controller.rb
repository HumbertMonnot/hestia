class SearchesController < ApplicationController
  def index
  end

  def show
    @search = Search.find(params[:search_id])
    @paras = [@search.address, @search.profile, @search.duration].json()
  end
end
