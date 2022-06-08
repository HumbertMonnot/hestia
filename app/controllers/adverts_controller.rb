class AdvertsController < ApplicationController
  skip_forgery_protection

  def index
    @ads = Advert.where(user: current_user)
    @ad = Advert.new
  end

  def create
    @ads = Advert.where(user: current_user)
    @ad = Advert.new(ad_params)
    @ad.user = current_user
    @ad.state = "pending"
    respond_to do |format|
      if @ad.save
        format.html { redirect_to adverts_path }
        format.json {}
      else
        format.html { render :index }
        format.json {}
      end
    end
  end

  def update
    @ads = Advert.where(user: current_user)
    @ad = Advert.find(params[:id])
    @user = @ad.user
    @ad.update(state: params[:state])
    if @ad.save
    	redirect_to adverts_path
    else
    	render :index
    end
  end

  def destroy
    @ad = Advert.find(params[:id])
    @ad.destroy
    redirect_to adverts_path
  end

  private

  def ad_params
    puts params
    params.require(:advert).permit(:title, :url, :size, :address, :price, :comment)
  end
end
